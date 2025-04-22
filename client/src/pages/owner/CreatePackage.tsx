
import React from 'react';
import PageTransition from '@/components/PageTransition';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import CreatePackageForm from '@/components/CreatePackageForm';
import BackButton from '@/components/BackButton';

const CreatePackage = () => {
  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col">
        <NavBar />
        
        <main className="flex-grow pt-24 pb-20">
          <div className="container mx-auto px-6">
            < BackButton className="mb-6" />
            <CreatePackageForm />
          </div>
        </main>
        
        <Footer />
      </div>
    </PageTransition>
  );
};

export default CreatePackage;
