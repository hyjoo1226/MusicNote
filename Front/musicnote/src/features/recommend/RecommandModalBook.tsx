import { Book } from "./recommendType";

export default function RecommandModalBook({ book, onClose }: { book: Book; onClose: () => void }) {
  return (
    <div
      className="w-screen h-screen fixed top-0 left-0 z-50 flex items-end justify-center animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[560px] overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col min-w-[296px] mx-3 xs:mx-5 max-h-[80vh] bg-level2 rounded-t-3xl p-3 xs:p-5 gap-5 overflow-y-auto">
          <div className="grid grid-cols-2">
            <div className="w-full h-auto">
              <img
                src={book.image}
                alt={book.title}
                className="max-h-[500px] w-auto rounded-lg object-cover"
              />
            </div>
            <div className="flex flex-col items-start pt-2 pl-2 xs:pt-4 xs:pl-4 gap-1">
              <span className="text-white text-xl xs:text-2xl font-medium">{book.title}</span>
              {book.pubdate && (
                <span className="text-light-gray text-sm font-light">
                  출판년도: {book.pubdate.split("-")[0]}
                </span>
              )}
              {book.publisher.length > 0 && (
                <span className="text-light-gray text-sm font-light">{book.publisher}</span>
              )}
              {book.author.length > 0 && (
                <span className="text-light-gray text-sm font-light">
                  저자:{" "}
                  {book.author
                    .split("^")
                    .map((author) => author.trim())
                    .join(", ")}
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col w-full items-start justify-center">
            <span className="flex text-white text-sm xs:text-base font-light break-keep leading-8 pb-5 sm:pb-0">
              {book.description.replace(".", ".\n")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
