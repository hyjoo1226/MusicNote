import TopBar from "@/components/layout/TopBar";
import { useEffect, useState } from "react";
import EmptyHeart from "@/assets/icon/empty-heart.svg?react";
import FilledHeart from "@/assets/icon/filled-heart.svg?react";
import RecommandModalBook from "@/features/recommend/RecommandModalBook";
import { Book } from "@/features/recommend/recommendType";
import { useGetData, usePostData, useDeleteData } from "@/hooks/useApi";

export default function MyRecommendationBook() {
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [isLikeProcessing, setIsLikeProcessing] = useState(false);
  const { data: likedBooks, refetch: refetchLikedBooks } = useGetData(
    "likedBooks",
    "recommend/like/book"
  );
  const {
    mutate: likeBook,
    isError: isLikeBookError,
    error: likeBookError,
  } = usePostData("recommend/like/book");

  const {
    mutate: deleteLikedBook,
    isError: isDeleteLikedBookError,
    error: deleteLikedBookError,
  } = useDeleteData("recommend/like/book");

  const likeHandler = (id: string, isbn: string) => {
    setIsLikeProcessing(true);
    const foundBook = books.find((book: Book) => book.id === id);

    // 책이 존재하고 is_liked가 true인 경우 좋아요 취소
    if (foundBook && foundBook.is_liked === true) {
      deleteLikedBook({
        recommendBookId: id,
        isbn: isbn,
      });
    } else {
      // 그렇지 않으면 좋아요 추가
      likeBook({
        recommendBookId: id,
        isbn: isbn,
      });
    }
    setBooks(books.map((book) => (book.id === id ? { ...book, is_liked: !book.is_liked } : book)));
    setIsLikeProcessing(false);
  };

  useEffect(() => {
    if (isLikeBookError) {
      console.log(likeBookError);
    }
  }, [isLikeBookError, likeBookError]);

  useEffect(() => {
    if (isDeleteLikedBookError) {
      console.log(deleteLikedBookError);
    }
  }, [isDeleteLikedBookError, deleteLikedBookError]);

  useEffect(() => {
    if (likedBooks) {
      const booksWithLiked = likedBooks.data.books.map((book: Book) => ({
        ...book,
        is_liked: true,
      }));
      setBooks(booksWithLiked.reverse());
    }
    if (!isUpdated) {
      setIsUpdated(true);
      refetchLikedBooks();
    }
  }, [likedBooks, refetchLikedBooks, isUpdated]);

  const handleBookClick = (book: Book) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  return (
    <div className="text-white w-full h-full">
      <TopBar title={"책 추천 보관함"} />
      <div className="mt-[20px] flex flex-col items-center justify-start bg-level2 rounded-3xl p-2 py-0 mx-3 xs:mx-5 border border-solid border-border min-h-[calc(100svh-120px)] overflow-y-auto">
        {books.map((book: Book, index: number) => (
          <div
            key={index}
            className="flex items-center justify-center py-3 w-full border-b border-solid border-border transition-all duration-200 hover:-translate-y-1 hover:bg-level3 hover:rounded-lg"
          >
            <div
              className="flex items-center justify-start gap-x-4 px-3 py-1 rounded-lg w-full"
              onClick={() => handleBookClick(book)}
              style={{ cursor: "pointer" }}
            >
              <img
                src={book.image}
                alt={book.title}
                className="w-[60px] h-[60px] flex-shrink-0 rounded-lg object-cover"
              />
              <div className="flex flex-col w-full min-w-0 overflow-hidden">
                <span className="text-light-gray text-sm font-light truncate">{book.author}</span>
                <span className="text-white text-base font-medium line-clamp-2">{book.title}</span>
              </div>
              <div
                className="flex w-10 flex-shrink-0 items-center justify-center hover:translate-y-[-5px] transition-all duration-200"
                onClick={(e) => {
                  e.stopPropagation();
                  likeHandler(book.id, book.isbn);
                }}
              >
                <div className={`${isLikeProcessing ? "opacity-50 pointer-events-none" : ""}`}>
                  {book.is_liked ? <FilledHeart /> : <EmptyHeart />}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {isModalOpen && selectedBook && (
        <RecommandModalBook book={selectedBook} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
}
