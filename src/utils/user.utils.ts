
export class UserUtils {
    static removePassword(user: any): any {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
  }
  