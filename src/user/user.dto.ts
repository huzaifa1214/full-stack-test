export class UserDTO {
  id: string;
  name: string;
  email: string;
}

export class UserLoginDTO {
  accessToken: string;
  user: UserDTO;
}
