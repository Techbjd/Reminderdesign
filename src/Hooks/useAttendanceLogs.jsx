import { useQuery } from "@tanstack/react-query";
import API from "../api/axios";

export default function useAttendanceLogs({ startDate, endDate, pagination }) {
  return useQuery({
    queryKey: ["attendanceLogs", startDate, endDate, pagination.pageIndex, pagination.pageSize],
    queryFn: async ({ signal }) => {
      const res = await API.get("/api/timesheets/attendencelogs/", {
        params: {
          start_date: startDate,
          end_date: endDate,
          page: pagination.pageIndex + 1,
          page_size: pagination.pageSize,
        },
        signal, 
      });

      const apiData = res.data;
      return {
        rows: apiData.data || [],
        total: apiData.count || apiData.data.length,
      };
    },
    keepPreviousData: true, 
  });
}
