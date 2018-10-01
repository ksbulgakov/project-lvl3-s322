export default (error) => {
  if (error.code) {
    const newMessage = {
      EEXIST: 'Dirrectory for resouces already exists. Can not save resourses',
      ENOENT: 'No such dirrectory. Please create directory in advance',
    };
    const newError = new Error(newMessage[error.code]);
    newError.code = error.code;
    return newError;
  }
  const message = `A response status ${error.response.status} was recieved. Please check the link`;
  const newError = new Error(message);
  newError.code = error.response.status;

  return newError;
};
