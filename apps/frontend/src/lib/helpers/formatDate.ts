export const formatDate = (date: string): string => new Date(date).toISOString().split("T")[0];
