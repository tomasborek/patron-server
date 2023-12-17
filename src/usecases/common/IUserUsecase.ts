interface IUserUsecase {
  auth: (email: string, password: string) => Promise<string>;
}

export default IUserUsecase;
