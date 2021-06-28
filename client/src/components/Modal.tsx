import React from 'react';
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
  Flex,
} from '@chakra-ui/react';

export interface ConditionalWrapProps {
  val: boolean | undefined | null | number | string;
  Wrap: (children: React.ReactNode | null | undefined) => JSX.Element | null;
}

export const ConditionalWrap: React.FC<ConditionalWrapProps> = (props) => {
  const { val, Wrap, children } = props;
  if (val) {
    return Wrap(children);
  }

  return <>{children}</>;
};

interface ModalProps {
  modalProps: UseDisclosureReturn;
  size?: ChakraModalProps['size'];
  title?: string;
  buttons?: React.ReactElement;
  buttonsLeft?: React.ReactElement;
  wrapBody?: ConditionalWrapProps['Wrap'];
  formButtonText?: string;
}

export const Modal: React.FC<ModalProps> = (props) => {
  const {
    modalProps,
    title,
    buttons,
    buttonsLeft,
    formButtonText,
    wrapBody,
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
        <ConditionalWrap val={!!wrapBody} Wrap={wrapBody || (() => null)}>
          <ModalBody>{children}</ModalBody>

          <ModalFooter>
            <ConditionalWrap
              val={!!buttonsLeft}
              Wrap={(c) => (
                <Flex w="full" justify="space-between">
                  {c}
                </Flex>
              )}
            >
              {buttonsLeft}
              <HStack>
                <Button colorScheme="blue" onClick={modalProps.onClose}>
                  Close
                </Button>
                {buttons}
                {formButtonText && (
                  <Button colorScheme={'green'} type="submit">
                    {formButtonText}
                  </Button>
                )}
              </HStack>
            </ConditionalWrap>
          </ModalFooter>
        </ConditionalWrap>
      </ModalContent>
    </ChakraModal>
  );
};
