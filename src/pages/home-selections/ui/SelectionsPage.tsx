import { CollectionCard, mockCollectionsColumn1, mockCollectionsColumn2 } from '../../../entities/collection';

export function SelectionsPage() {
  return (
    <div className="px-4 py-4">
      <div className="flex gap-3">
        <div className="flex-1 flex flex-col gap-3">
          {mockCollectionsColumn1.map((collection) => (
            <CollectionCard
              key={collection.id}
              title={collection.title}
              backgroundColor={collection.backgroundColor}
              size={collection.size}
              onClick={() => console.log('Collection clicked:', collection.id)}
            />
          ))}
        </div>
        <div className="flex-1 flex flex-col gap-3">
          {mockCollectionsColumn2.map((collection) => (
            <CollectionCard
              key={collection.id}
              title={collection.title}
              backgroundColor={collection.backgroundColor}
              size={collection.size}
              onClick={() => console.log('Collection clicked:', collection.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
