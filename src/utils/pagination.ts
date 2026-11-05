// Utility functions for pagination in the application. A supprimer lorsque la pagination sera gérée par la base de données.

export function paginate<T>(items: T[], page: number, pageSize: number) {
  return {
    items: items.slice((page - 1) * pageSize, page * pageSize),
    total: items.length,
    page,
    pageSize,
  };
}
