import { useQuery, useMutation } from "@tanstack/react-query";
import apiClient from "@/api/apiClient";

// GET 요청을 위한 커스텀 훅
export const useGetData = (key: string, url: string, options = {}) => {
  return useQuery({
    queryKey: [key],
    queryFn: () => apiClient.get(url).then((res: any) => res.data),
    ...options,
  });
};

// POST 요청을 위한 커스텀 훅
export const usePostData = (url: string) => {
  return useMutation({
    mutationFn: (data: any) => apiClient.post(url, data).then((res: any) => res.data),
  });
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
//   const postMutation = usePostData('/api/posts');

//   const handleSubmit = (data) => {
//     postMutation.mutate(data, {
//       onSuccess: (response) => {
//         console.log('성공:', response);
//       }
//     });
//   };

//   return (/* 폼 컴포넌트 */);
// }
