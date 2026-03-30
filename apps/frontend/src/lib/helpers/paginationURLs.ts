interface PaginationURLs {
  canonicalURL: string;
  prevURL: string | undefined;
  nextURL: string | undefined;
}

export const buildPaginationURLs = (
  baseURL: string,
  currentPage: number,
  totalPages: number,
): PaginationURLs => {
  const canonicalURL = currentPage === 1 ? baseURL : `${baseURL}?page=${currentPage}`;
  const prevURL =
    currentPage > 1
      ? currentPage === 2
        ? baseURL
        : `${baseURL}?page=${currentPage - 1}`
      : undefined;
  const nextURL = currentPage < totalPages ? `${baseURL}?page=${currentPage + 1}` : undefined;
  return { canonicalURL, prevURL, nextURL };
};
