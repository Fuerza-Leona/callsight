import { useState } from 'react';
import api from '@/utils/api';
import { useRouter } from 'next/navigation';

export interface ReportResponse {
  success: boolean;
  report: {
    report_id: string;
    report_name: string;
    file_url: string;
    created_at: string;
  };
  period: {
    month: number;
    year: number;
    start_date: string;
    end_date: string;
  };
}

export const useFetchReport = () => {
  const [report, setReport] = useState<string>();
  const [loadingReport, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchReport = async () => {
    setLoading(true);
    try {
      const response = await api.post<ReportResponse>(`reports/monthly`, {});
      setReport(response.data.report.file_url || '');
      router.push(response.data.report.file_url);
    } catch {
      setError('Error fetching report');
    } finally {
      setLoading(false);
    }
  };

  return { report, loadingReport, error, fetchReport };
};
