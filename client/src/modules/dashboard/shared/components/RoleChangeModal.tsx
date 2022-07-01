import { Button, Select, Text, UseDisclosureReturn } from '@chakra-ui/react';
import { useConfirm } from 'chakra-confirm';
import React from 'react';
import { useForm } from 'react-hook-form';

import { Modal } from '../../../../components/Modal';

export interface RoleChangeModalData {
  roleId: number;
  userId: number;
  userName: string;
}

interface SubmitData {
  newRoleId: number;
  userId: number;
}

export const RoleChangeModal: React.FC<{
  modalProps: UseDisclosureReturn;
  data: RoleChangeModalData;
  roles: { id: number; name: string }[];
  title: string;
  onSubmit: (submitData: SubmitData) => void;
}> = ({ modalProps, data, roles, title, onSubmit }) => {
  const { handleSubmit, register, setValue, getValues } = useForm<SubmitData>();

  const confirm = useConfirm();

  const confirmSubmit = async (data: SubmitData) => {
    const ok = await confirm({
      body: 'Are you sure you want to change role?',
    });
    if (ok) {
      onSubmit(data);
    }
  };

  setValue('userId', data.userId);
  setValue('newRoleId', data.roleId);

  return (
    <Modal
      modalProps={modalProps}
      title={title}
      formButtonText="Change"
      wrapChildren={(children) => (
        <form onSubmit={handleSubmit(confirmSubmit)}>{children}</form>
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
