import React from 'react'
import { Description, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'

type TConfirmDialog = {
    isOpen: boolean;
    description: string;
    onConfirm: () => void;
    onCancel: () => void;
}


const ConfirmDialog: React.FC<TConfirmDialog> = ({
    isOpen,
    description,
    onConfirm,
    onCancel
}) => {
    return (
        <Dialog open={isOpen} onClose={onCancel} className="fixed inset-0 z-50">
            <div className="flex items-center justify-center min-h-screen p-4">
                <DialogPanel className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <DialogTitle className="text-lg font-semibold">Are you sure?</DialogTitle>
                    <Description className="mt-2 text-sm">{description}</Description>
                    <div className="mt-4 flex gap-4 justify-end">
                        <button
                            onClick={onCancel}
                            className="px-4 py-2 text-gray-600 bg-gray-200 rounded hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            className="px-4 py-2 text-white bg-indigo-500 rounded hover:bg-indigo-600"
                        >
                            Confirm
                        </button>
                    </div>
                </DialogPanel>
            </div>
        </Dialog>
    )
}

export default ConfirmDialog