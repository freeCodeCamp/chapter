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
}

export const ConditionalWrap: React.FC<ConditionalWrapProps> = (props) => {
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
  wrapLeftButtons?: ConditionalWrapProps['Wrap'];
  formButtonText?: string;
}

export const Modal: React.FC<ModalProps> = (props) => {
  const {
    modalProps,
    title,
    buttons,
    buttonsLeft,
    formButtonText,
    wrapChildren,
    wrapLeftButtons,
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
            <ConditionalWrap Wrap={wrapLeftButtons}>
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
