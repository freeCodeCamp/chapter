import { InputType, Field } from 'type-graphql';
import { User } from '../../graphql-types';

@InputType()
export class UpdateUserInputs implements Omit<User, 'id'> {
  @Field(() => String, { nullable: true })
  name: string;
  @Field(() => String, { nullable: true })
  email: string;
}
