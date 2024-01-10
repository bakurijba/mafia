import { toast } from "sonner"

export const showSuccessMessage = (message: string): void => {
  toast.success(message)
}

export const showErrorMessage = (message: string): string | number => {
  return toast.error(message)
}
