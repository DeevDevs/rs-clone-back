exports.createUserBody = (body) => {
  return {
    name: body.name,
    email: body.email,
    password: body.password,
    role: body.role === "admin" ? undefined : body.role,
    statsID: "",
    memoirIDs: [],
    passwordConfirm: body.passwordConfirm,
  };
};
