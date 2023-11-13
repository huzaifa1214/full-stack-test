import { UserDTO } from './user.dto';
import { User } from './user.model';

class UserMapper {
  static toDTO = (models: User[]): UserDTO[] => {
    return models.map((model) => {
      return {
        id: model.id,
        name: model.name,
        email: model.email,
      };
    });
  };
}

export default UserMapper;
