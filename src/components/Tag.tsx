interface tagProps {
  text: string;
}

export default function Tag(t: tagProps) {
  return (
    <div className="bg-[#89D2E6] p-2 rounded-md">
      <p>{t.text}</p>
    </div>
  );
}
