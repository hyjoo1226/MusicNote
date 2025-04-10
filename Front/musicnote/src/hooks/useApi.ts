import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryResult,
  useQueries,
} from "@tanstack/react-query";
import { apiClient, spotifyApiClient } from "@/api/apiClient";

// GET 요청을 위한 커스텀 훅
export const useGetData = (key: string, url: string, client: string = "default", options = {}) => {
  return useQuery({
    queryKey: [key],
    queryFn: () =>
      client === "spotify"
        ? spotifyApiClient.get(url).then((res: any) => res.data)
        : apiClient.get(url).then((res: any) => res.data),
    ...options,
  });
};

// 여러 데이터를 병렬로 GET 요청하는 훅
export const useGetMultipleData = (
  keys: string[],
  urls: string[],
  client: string = "default"
): UseQueryResult<any, Error>[] => {
  return useQueries({
    queries: urls.map((url, index) => ({
      queryKey: [keys[index]],
      queryFn: () =>
        client === "spotify"
          ? spotifyApiClient.get(url).then((res: any) => res.data)
          : apiClient.get(url).then((res: any) => res.data),
    })),
  });
};

// POST 요청을 위한 커스텀 훅
export const usePostData = (url: string, options = {}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: any | null) =>
      apiClient.post(url, data).then((res: any) => {
        // 응답에서 status, message, data를 추출
        const { status, message, data: responseData } = res.data;
        return { status, message, data: responseData };
      }),
    onSuccess: (data) => {
      // 성공 시 캐시 업데이트
      queryClient.setQueryData([url], data);
    },
    ...options,
  });

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
    data: mutation.data?.data, // 실제 데이터만 반환
    status: mutation.data?.status, // 응답 상태 코드
    message: mutation.data?.message, // 응답 메시지
    reset: mutation.reset,
  };
};

// DELETE 요청을 위한 커스텀 훅
export const useDeleteData = (url: string, options = {}) => {
  const mutation = useMutation({
    mutationFn: (data: any) =>
      apiClient.delete(url, { data: data }).then((res: any) => {
        // 응답에서 status, message, data를 추출
        const { status, message, data: responseData } = res.data;
        return { status, message, data: responseData };
      }),
    ...options,
  });

  return {
    mutate: mutation.mutate,
    isError: mutation.isError,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
};

// 예시
// 컴포넌트에서 사용
// import { useGetData, usePostData } from '../hooks/useApi';

// function UserProfile() {
//   const { data, isLoading, error } = useGetData('user', '/api/user/profile');

//   if (isLoading) return <div>로딩 중...</div>;
//   if (error) return <div>에러 발생: {error.message}</div>;

//   return <div>{data.name}님, 환영합니다!</div>;
// }

// function CreatePost() {
//   const { mutate, isLoading, status, message, data } = usePostData('/api/posts');

//   const handleSubmit = (formData) => {
//     mutate(formData);
//   };

//   if (isLoading) return <div>저장 중...</div>;
//   if (status === 200) return <div>성공: {message}</div>;

//   return (/* 폼 컴포넌트 */);
// }
