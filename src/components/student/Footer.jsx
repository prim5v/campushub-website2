
import React from 'react';

export function Footer() {
  return (
    <footer className="py-8 text-center pb-12 lg:pb-8">
      <p className="text-sm text-gray-400 font-medium">
        © {new Date().getFullYear()} CampusHub. All rights reserved.
      </p>
    </footer>);

}