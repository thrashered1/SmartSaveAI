import { Dialog, DialogContent } from '../components/ui/dialog';

// Update all modal DialogContent to have max-w-lg (70% width)
export const ModalWrapper = ({ children, ...props }) => (
  <Dialog {...props}>
    <DialogContent className="bg-black border border-white/10 max-w-lg p-0 gap-0">
      {children}
    </DialogContent>
  </Dialog>
);