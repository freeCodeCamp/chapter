import { Button, Select, Text, UseDisclosureReturn } from '@chakra-ui/react';
import React from 'react';
import { useForm } from 'react-hook-form';

import { Modal } from '../../../../components/Modal';

export interface RoleChangeModalData {
  roleId: number;
  userId: number;
  userName: string;
}

export const RoleChangeModal: React.FC<{
  modalProps: UseDisclosureReturn;
  data: RoleChangeModalData;
  roles: { id: number; name: string }[];
  title: string;
  onSubmit: (submitData: {
    newRoleId: number;
    userId: number;
  }) => Promise<void>;
}> = ({ modalProps, data, roles, title, onSubmit }) => {
  const { handleSubmit, register, setValue, getValues } = useForm<{
    newRoleId: number;
    userId: number;
  }>();

  setValue('userId', data.userId);
  setValue('newRoleId', data.roleId);

  return (
    <Modal
      modalProps={modalProps}
      title={title}
      buttons={<Button type="submit">Change</Button>}
      wrapBody={(children) => (
        <form onSubmit={handleSubmit(onSubmit)}>{children}</form>
      )}
    >
      <Text>Select role for {data.userName}</Text>
      <Select
        defaultValue={getValues('newRoleId')}
        {...register('newRoleId', { valueAsNumber: true })}
      >
        {roles.map(({ id, name }) => (
          <option key={id} value={id}>
            {name}
          </option>
        ))}
      </Select>
    </Modal>
  );
};
