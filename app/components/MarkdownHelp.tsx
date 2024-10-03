'use client';
import React, { useState, Fragment } from 'react';
import { Dialog, Transition, TransitionChild, DialogTitle, DialogPanel } from '@headlessui/react';
import { InformationCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

const markdownSyntax = `
# Markdown Syntax Guide

## Headers
- # H1
- ## H2
- ### H3

## Lists
- - List item
- 1. Ordered list item

## Formatting
- **Bold:** bold
- *Italic:* italic
- [Link](https://example.com)

## Code Block
\`\`\`javascript
console.log('Hello, world!');
\`\`\`

## Images
- ![Alt Text](image_url)
`;

export default function MarkdownHelp() {
  const [isOpen, setIsOpen] = useState(false);

  const openDialog = () => setIsOpen(true);
  const closeDialog = () => setIsOpen(false);

  return (
    <>
      <button
        onClick={openDialog}
        className="fixed bottom-4 right-4 w-12 h-12 bg-gray-800 text-white rounded-full flex items-center justify-center hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <InformationCircleIcon className="h-6 w-6" />
      </button>

      <Transition show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeDialog}>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-30 transition-opacity" />
          </TransitionChild>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen p-4 text-center">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel className="relative bg-white dark:bg-gray-800 rounded-lg max-w-3xl w-full p-6">
                  <DialogTitle as="h3" className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                    Markdown Syntax
                  </DialogTitle>
                  <button
                    onClick={closeDialog}
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                  <div className="mt-4 text-left">
                    <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                      {markdownSyntax}
                    </pre>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
