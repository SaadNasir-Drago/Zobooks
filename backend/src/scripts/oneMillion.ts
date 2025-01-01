export function duplicateDatasetToMillionEntries(
  dataset: any[],
  targetCount: number
): any[] {
  const result = [];
  let currentIndex = 0;

  // Loop until we generate one million entries
  for (let i = 0; i < targetCount; i++) {
    // Get the current entry from the dataset, duplicating it if necessary
    const entry = { ...dataset[currentIndex % dataset.length] }; // Duplicate the current entry

    result.push(entry);
    currentIndex++;
  }

  return result;
}
