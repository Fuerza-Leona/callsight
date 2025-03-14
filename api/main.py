import os
import json
from fastapi import FastAPI
from dotenv import load_dotenv
from azure.core.credentials import AzureKeyCredential
from azure.ai.language.conversations import ConversationAnalysisClient

from azure.ai.textanalytics import TextAnalyticsClient
from azure.core.credentials import AzureKeyCredential

from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

endpoint = os.getenv("LANGUAGE_ENDPOINT")
key = os.getenv("LANGUAGE_KEY")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def parse_transcript(file_path):
    conversation_items = []
    with open(file_path, "r", encoding="utf-8") as file:
        lines = file.readlines()

    for index, line in enumerate(lines):
        if ": " in line:
            participant, text = line.split(": ", 1)
            conversation_items.append({
                "text": text.strip(),
                "modality": "text",
                "id": str(index + 1),
                "participantId": participant.strip()
            })

    return {
        "conversations": [
            {
                "conversationItems": conversation_items,
                "modality": "text",
                "id": "conversation1",
                "language": "es"
            }
        ]
    }

@app.get("/analyze/emotions")
def analyze_emotions():
    credential = AzureKeyCredential(key)
    client = TextAnalyticsClient(endpoint=endpoint, credential=credential)

    document_name = "callCenter.txt"
    file_path = os.path.join(os.getcwd(), document_name)

    if not os.path.exists(file_path):
        return {"error": f"File {document_name} not found"}

    with open(file_path, "r", encoding="utf-8") as f:
        document_content = f.read()

    if not document_content:
        return {"error": "The document is empty"}

    try:
        sentiment_results = client.analyze_sentiment([document_content])
        emotions = []

        for doc in sentiment_results:
            if not doc.is_error:
                emotions.append({
                    "overall_sentiment": doc.sentiment,
                    "positive_score": doc.confidence_scores.positive,
                    "negative_score": doc.confidence_scores.negative,
                    "neutral_score": doc.confidence_scores.neutral
                })
            else:
                emotions.append({"error": doc.error})

        return {"emotions": emotions}

    except Exception as e:
        return {"error": str(e)}


@app.get("/analyze/callcenter")
def analyze_transcript():
    conversation_data = parse_transcript("callCenter.txt")
    
    credential = AzureKeyCredential(key)
    client = ConversationAnalysisClient(endpoint, credential)

    with client:
        poller = client.begin_conversation_analysis(
            task={
                "displayName": "Analyze conversations from file",
                "analysisInput": conversation_data,
                "tasks": [
                    {
                        "taskName": "Issue task",
                        "kind": "ConversationalSummarizationTask",
                        "parameters": {
                            "summaryAspects": ["issue"]
                        }
                    },
                    {
                        "taskName": "Resolution task",
                        "kind": "ConversationalSummarizationTask",
                        "parameters": {
                            "summaryAspects": ["resolution"]
                        }
                    },
                ]
            }
        )

        result = poller.result()
        task_results = result["tasks"]["items"]
        structured_summary = {}

        for task in task_results:
            task_name = task["taskName"]
            task_result = task["results"]

            if task_result["errors"]:
                structured_summary[task_name] = "Error occurred"
            else:
                conversation_result = task_result["conversations"][0]
                structured_summary[task_name] = {
                    summary["aspect"]: summary["text"] for summary in conversation_result["summaries"]
                }

        return structured_summary