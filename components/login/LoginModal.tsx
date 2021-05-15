import Modal from "../Modal";
import { LoginComponent } from "./LoginComponent";

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  title,
  onLoginCompleted = () => null,
  ...props
}) => {
  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} title={title} {...props}>
      <div className="flex items-center justify-center p-10 mx-12">
        <LoginComponent onLoginCompleted={onLoginCompleted} />
      </div>
    </Modal>
  );
};

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  onLoginCompleted?: () => void;
}
