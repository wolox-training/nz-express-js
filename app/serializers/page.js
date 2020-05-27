exports.pageSerializer = (queryResult, request, serializerFunction) => {
  const itemCount = queryResult.count;
  const pageCount = Math.ceil(queryResult.count / request.query.limit);

  return {
    data: queryResult.rows.map(element => serializerFunction(element)),
<<<<<<< HEAD
    totalElements: itemCount,
=======
    totalUsers: itemCount,
>>>>>>> Add serializers
    page: request.query.page,
    totalPages: pageCount
  };
};
