import { Select, Text, UseDisclosureReturn } from '@chakra-ui/react';
import { useConfirm } from 'chakra-confirm';
import React from 'react';
import { useForm } from 'react-hook-form';

import { Modal } from '../../../../components/Modal';

export interface RoleChangeModalData {
  roleName: string;
  userId: number;
  userName: string;
}

interface SubmitData {
  newRoleName: string;
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
  const currentRole = data.roleName;

  const confirm = useConfirm();

  const confirmSubmit = async (data: SubmitData) => {
    if (data.newRoleName === currentRole) {
      modalProps.onClose();
      return;
    }
    const ok = await confirm({
      body: 'Are you sure you want to change role?',
    });
    if (ok) {
      onSubmit(data);
    }
  };

  setValue('userId', data.userId);
  setValue('newRoleName', data.roleName);

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
        defaultValue={getValues('newRoleName')}
        {...register('newRoleName')}
      >
        {roles.map(({ id, name }) => (
          <option key={id} value={name}>
            {name}
          </option>
        ))}
      </Select>
    </Modal>
  );
};
