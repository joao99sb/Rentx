export interface ICreateUserDTO {
  name: string;
  id?: string;
  avatar?: string;
  password: string;
  email: string;
  driver_license: string;
}
