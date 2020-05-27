exports.pageSerializer = (queryResult, request, serializerFunction) => {
  const itemCount = queryResult.count;
  const pageCount = Math.ceil(queryResult.count / request.query.limit);

  return {
    data: queryResult.rows.map(element => serializerFunction(element)),
    totalElements: itemCount,
    page: request.query.page,
    totalPages: pageCount
  };
};
