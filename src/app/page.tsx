'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/transaction-page/Header';
import { AddTransactionChoiceModal } from '@/components/transaction-page/AddTransactionChoiceModal';
import { AddTransactionModal } from '@/components/transaction-page/AddTransactionModal';
import { FilterChips } from '@/components/transaction-page/FilterChips';
import { FilterBar } from '@/components/transaction-page/FilterBar';
import { TransactionList } from '@/components/transaction-page/TransactionList';
import { ViewTransactionModal } from '@/components/transaction-page/ViewTransactionModal';
import { EditTransactionModal } from '@/components/transaction-page/EditTransactionModal';
import { DeleteConfirmationDialog } from '@/components/transaction-page/DeleteConfirmationDialog';
import { SummaryFooter } from '@/components/transaction-page/SummaryFooter';
import { FloatingActionButton } from '@/components/transaction-page/FloatingActionButton';
import { useTransactionManager } from '@/hooks/useTransactionManager';
import { Transaction } from '@/lib/mock-data';

export default function TransactionPage() {
  const {
    transactions,
    searchTerm,
    setSearchTerm,
    filterType,
    setFilterType,
    filterCategory,
    setFilterCategory,
    filterMethod,
    setFilterMethod,
    filterDateRange,
    setFilterDateRange,
    sortOption,
    setSortOption,
    deleteTransaction,
    duplicateTransaction,
    updateTransaction,
    addTransaction,
  } = useTransactionManager();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [addType, setAddType] = useState<'income' | 'expense' | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'delete' | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Simulate loading state when filters change
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, [searchTerm, filterType, filterCategory, filterMethod, filterDateRange, sortOption]);

  const handleOpenModal = (t: Transaction, mode: 'view' | 'edit' | 'delete') => {
    setSelectedTransaction(t);
    setModalMode(mode);
  };

  const closeModal = () => {
    setSelectedTransaction(null);
    setModalMode(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 md:p-8 lg:p-12 pb-32">
      <div className="max-w-6xl mx-auto">
        <Header
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onAddClick={() => setIsAddModalOpen(true)}
        />

        <div className="flex flex-col gap-4 mb-8">
          <div className="flex flex-col gap-4">
            <FilterChips
              activeRange={filterDateRange}
              onRangeChange={setFilterDateRange}
            />
            <FilterBar
              filterType={filterType}
              setFilterType={setFilterType}
              filterCategory={filterCategory}
              setFilterCategory={setFilterCategory}
              filterMethod={filterMethod}
              setFilterMethod={setFilterMethod}
              sortOption={sortOption}
              setSortOption={setSortOption}
            />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <TransactionList
            transactions={transactions}
            isLoading={isLoading}
            onView={(t) => handleOpenModal(t, 'view')}
            onEdit={(t) => handleOpenModal(t, 'edit')}
            onDelete={(id) => {
              const t = transactions.find(x => x.id === id);
              if (t) handleOpenModal(t, 'delete');
            }}
            onDuplicate={duplicateTransaction}
          />
        </div>

        <AddTransactionChoiceModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSelectType={(type) => {
            setAddType(type);
            setIsAddModalOpen(false);
            setIsAddFormOpen(true);
          }}
        />

        <AddTransactionModal
          isOpen={isAddFormOpen}
          onClose={() => setIsAddFormOpen(false)}
          type={addType || 'expense'}
          onSave={(data) => {
            addTransaction(data);
            setIsAddFormOpen(false);
          }}
        />

        <ViewTransactionModal
          isOpen={modalMode === 'view'}
          onClose={closeModal}
          transaction={selectedTransaction}
        />

        <EditTransactionModal
          isOpen={modalMode === 'edit'}
          onClose={closeModal}
          transaction={selectedTransaction}
          onSave={(updates) => {
            if (selectedTransaction) {
              updateTransaction(selectedTransaction.id, updates);
            }
          }}
        />

        <DeleteConfirmationDialog
          isOpen={modalMode === 'delete'}
          onClose={closeModal}
          transaction={selectedTransaction}
          onConfirm={() => {
            if (selectedTransaction) {
              deleteTransaction(selectedTransaction.id);
            }
            closeModal();
          }}
        />

        <SummaryFooter transactions={transactions} />
        <FloatingActionButton onClick={() => setIsAddModalOpen(true)} />
      </div>
    </div>
  );
}
