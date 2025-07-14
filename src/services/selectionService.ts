export class SelectionService {
  /**
   * Toggle selection for a single item
   */
  static toggleSelection(selectedIds: Set<string>, id: string): Set<string> {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    return newSet;
  }

  /**
   * Select all items
   */
  static selectAll(ids: string[]): Set<string> {
    return new Set(ids);
  }

  /**
   * Clear all selections
   */
  static clearSelection(): Set<string> {
    return new Set();
  }

  /**
   * Check if an item is selected
   */
  static isSelected(selectedIds: Set<string>, id: string): boolean {
    return selectedIds.has(id);
  }

  /**
   * Get count of selected items
   */
  static getSelectionCount(selectedIds: Set<string>): number {
    return selectedIds.size;
  }

  /**
   * Select multiple items
   */
  static selectMultiple(selectedIds: Set<string>, ids: string[]): Set<string> {
    const newSet = new Set(selectedIds);
    ids.forEach(id => newSet.add(id));
    return newSet;
  }

  /**
   * Deselect multiple items
   */
  static deselectMultiple(selectedIds: Set<string>, ids: string[]): Set<string> {
    const newSet = new Set(selectedIds);
    ids.forEach(id => newSet.delete(id));
    return newSet;
  }

  /**
   * Toggle multiple selections
   */
  static toggleMultiple(selectedIds: Set<string>, ids: string[]): Set<string> {
    const newSet = new Set(selectedIds);
    ids.forEach(id => {
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
    });
    return newSet;
  }
} 