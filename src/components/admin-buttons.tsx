import { useCatalog } from "@/app/context/catalog-context";

export default function AdminButtons() {

  const { loadItems, busy, isLoaded, setEditItem, openDeleteList } = useCatalog();

  const handleLoad = async () => {
    if(busy || isLoaded) return;
    await loadItems();
  }

  const handleAddClick = () => {
    if(busy || !isLoaded) return;
    setEditItem();
  }

  const handleDeleteClick = () => {
    if(busy || !isLoaded) return;
    openDeleteList();
  }

  const getText = () => {
    if(isLoaded) return 'Loaded';
    if(busy) return 'Loading...';
    return 'Load';
  }


  return (
    <div className="buttons">
       <button onClick={handleLoad} disabled={busy || isLoaded}>{getText()}</button>
       <button onClick={handleAddClick} disabled={busy || !isLoaded}>Add</button>
       <button disabled={busy || !isLoaded} onClick={handleDeleteClick}>Delete</button>
    </div>
  );
}