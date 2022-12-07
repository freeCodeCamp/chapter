import {
  Modal as ChakraModal,
  UseDisclosureReturn,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Heading,
  ModalProps as ChakraModalProps,
  HStack,
} from '@chakra-ui/react';
import React from 'react';

export interface ConditionalWrapProps {
  Wrap?: (children: React.ReactNode | null | undefined) => JSX.Element;
  children: React.ReactNode;
}

export const ConditionalWrap = (props: ConditionalWrapProps) => {
  const { Wrap, children } = props;
  return Wrap ? Wrap(children) : <>{children}</>;
};

interface ModalProps {
  modalProps: UseDisclosureReturn;
  size?: ChakraModalProps['size'];
  title?: string;
  buttons?: React.ReactElement;
  buttonsLeft?: React.ReactElement;
  wrapChildren?: ConditionalWrapProps['Wrap'];
  formButtonText?: string;
  children: React.ReactNode;
}

export const Modal = (props: ModalProps) => {
  const {
    modalProps,
    title,
    buttons,
    buttonsLeft,
    formButtonText,
    wrapChildren,
    size = 'xl',
    children,
  } = props;

  return (
    <ChakraModal size={size} {...modalProps}>
      <ModalOverlay />
      <ModalContent>
        {title && (
          <ModalHeader>
            <Heading>{title}</Heading>
          </ModalHeader>
        )}
        <ModalCloseButton />
        <ConditionalWrap Wrap={wrapChildren}>
          <ModalBody>{children}</ModalBody>

          <ModalFooter>
            {buttonsLeft}
            <HStack>
              <Button onClick={modalProps.onClose}>Close</Button>
              {buttons}
              {formButtonText && (
                <Button colorScheme={'blue'} type="submit">
                  {formButtonText}
                </Button>
              )}
            </HStack>
          </ModalFooter>
        </ConditionalWrap>
      </ModalContent>
    </ChakraModal>
  );
};
