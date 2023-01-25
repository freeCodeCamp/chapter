import { TextArea } from '../../components/Form/TextArea';
import { Input } from '../../components/Form/Input';

export const fieldTypeToComponent = (type: string) => {
  if (type === 'textarea') {
    return TextArea;
  }
  return Input;
};
