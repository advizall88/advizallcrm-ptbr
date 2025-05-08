import React from 'react';
import AppLayout from './AppLayout';

const MobileMenuDemo = () => {
  return (
    <AppLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Mobile Menu Demo</h1>
        <p className="text-gray-600">
          This is a demonstration of the mobile navigation menu.
        </p>
        <p className="text-gray-600">
          Resize the screen to a mobile width or use your browser's device 
          emulation to see the hamburger menu in the top left corner.
        </p>
        <div className="p-4 bg-secondary/10 rounded-md border border-secondary/20">
          <h2 className="font-medium text-secondary">Instructions</h2>
          <ul className="list-disc pl-5 mt-2 space-y-2">
            <li>On mobile screens, a menu button appears in the top-left corner</li>
            <li>Click the menu button to open the navigation drawer</li>
            <li>Select any menu item to navigate</li>
            <li>The menu automatically closes after selection</li>
          </ul>
        </div>
      </div>
    </AppLayout>
  );
};

export default MobileMenuDemo; 