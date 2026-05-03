'use client';

import { useState } from 'react';
import { PropertyInputs } from '@/lib/calculator/types';
import { SavedConfiguration } from '@/lib/calculator/savedConfigTypes';
import { Card } from '@/components/ui/Card';
import { formatCompact } from '@/lib/calculator/format';

interface SavedConfigurationsPanelProps {
  currentInputs: PropertyInputs;
  configurations: SavedConfiguration[];
  activeConfigId: string | null;
  onSave: (name: string, inputs: PropertyInputs) => void;
  onLoad: (id: string) => void;
  onRename: (id: string, newName: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, inputs: PropertyInputs) => void;
}

export function SavedConfigurationsPanel({
  currentInputs,
  configurations,
  activeConfigId,
  onSave,
  onLoad,
  onRename,
  onDelete,
  onUpdate,
}: SavedConfigurationsPanelProps) {
  const [isExpanded, setIsExpanded] = useState(configurations.length > 0);
  const [newConfigName, setNewConfigName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const handleSave = () => {
    if (newConfigName.trim()) {
      onSave(newConfigName, currentInputs);
      setNewConfigName('');
    }
  };

  const handleStartRename = (config: SavedConfiguration) => {
    setEditingId(config.id);
    setEditingName(config.name);
  };

  const handleConfirmRename = () => {
    if (editingId && editingName.trim()) {
      onRename(editingId, editingName);
      setEditingId(null);
      setEditingName('');
    }
  };

  const handleCancelRename = () => {
    setEditingId(null);
    setEditingName('');
  };

  return (
    <Card className="mb-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-left -m-4 p-4"
      >
        <span className="text-lg font-semibold text-gray-900">
          Saved Scenarios {configurations.length > 0 && `(${configurations.length})`}
        </span>
        <ChevronIcon expanded={isExpanded} />
      </button>

      {isExpanded && (
        <div className="mt-4 space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={newConfigName}
              onChange={(e) => setNewConfigName(e.target.value)}
              placeholder="Scenario name..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            />
            <button
              onClick={handleSave}
              disabled={!newConfigName.trim()}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Save
            </button>
          </div>

          {configurations.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">
              No saved scenarios yet. Enter a name above and click Save.
            </p>
          ) : (
            <ul className="space-y-2">
              {configurations.map((config) => (
                <ConfigurationItem
                  key={config.id}
                  config={config}
                  isActive={config.id === activeConfigId}
                  isEditing={config.id === editingId}
                  editingName={editingName}
                  currentInputs={currentInputs}
                  onEditingNameChange={setEditingName}
                  onLoad={() => onLoad(config.id)}
                  onStartRename={() => handleStartRename(config)}
                  onConfirmRename={handleConfirmRename}
                  onCancelRename={handleCancelRename}
                  onDelete={() => onDelete(config.id)}
                  onUpdate={() => onUpdate(config.id, currentInputs)}
                />
              ))}
            </ul>
          )}
        </div>
      )}
    </Card>
  );
}

interface ConfigurationItemProps {
  config: SavedConfiguration;
  isActive: boolean;
  isEditing: boolean;
  editingName: string;
  currentInputs: PropertyInputs;
  onEditingNameChange: (name: string) => void;
  onLoad: () => void;
  onStartRename: () => void;
  onConfirmRename: () => void;
  onCancelRename: () => void;
  onDelete: () => void;
  onUpdate: () => void;
}

function ConfigurationItem({
  config,
  isActive,
  isEditing,
  editingName,
  currentInputs,
  onEditingNameChange,
  onLoad,
  onStartRename,
  onConfirmRename,
  onCancelRename,
  onDelete,
  onUpdate,
}: ConfigurationItemProps) {
  const summary = `${formatCompact(config.inputs.totalValue)} | ${config.inputs.squareMeters} sqm`;
  const hasChanges = isActive && JSON.stringify(config.inputs) !== JSON.stringify(currentInputs);

  return (
    <li
      className={`p-3 rounded-lg border transition-colors ${
        isActive
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-200 bg-white hover:border-gray-300'
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={editingName}
                onChange={(e) => onEditingNameChange(e.target.value)}
                className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') onConfirmRename();
                  if (e.key === 'Escape') onCancelRename();
                }}
              />
              <button
                onClick={onConfirmRename}
                className="text-green-600 text-sm font-medium hover:text-green-700"
              >
                Save
              </button>
              <button
                onClick={onCancelRename}
                className="text-gray-500 text-sm hover:text-gray-700"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={onLoad}
              className="w-full text-left"
            >
              <p className="font-medium text-gray-900 truncate">{config.name}</p>
              <p className="text-xs text-gray-500">{summary}</p>
            </button>
          )}
        </div>

        {!isEditing && (
          <div className="flex items-center gap-1">
            {hasChanges && (
              <button
                onClick={onUpdate}
                className="px-2 py-1 text-xs text-green-600 hover:bg-green-100 rounded font-medium"
                title="Update with current values"
              >
                Update
              </button>
            )}
            <button
              onClick={onStartRename}
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
              title="Rename"
            >
              <PencilIcon />
            </button>
            <button
              onClick={onDelete}
              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded"
              title="Delete"
            >
              <TrashIcon />
            </button>
          </div>
        )}
      </div>
    </li>
  );
}

function ChevronIcon({ expanded }: { expanded: boolean }) {
  return (
    <svg
      className={`w-5 h-5 text-gray-500 transition-transform ${expanded ? 'rotate-180' : ''}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
      />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
      />
    </svg>
  );
}
