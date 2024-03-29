import Modal from "../Modal";
import { LoginComponent } from "./LoginComponent";

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  title,
  onClose = () => null,
  onLoginCompleted = () => null,
  ...props
}) => {
  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} title={title} {...props}>
      <div className="flex items-center justify-center p-5 md:p-10 md:mx-12">
        <LoginComponent onLoginCompleted={onLoginCompleted} />
      </div>
    </Modal>
  );
};

interface LoginModalProps {
  isOpen: boolean;
  title: string;
  onClose?: () => void;
  onLoginCompleted?: (user) => any;
}
