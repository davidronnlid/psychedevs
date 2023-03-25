type Props = {
  itemType: string;
};

const RemovedItemsMessage: React.FC<Props> = ({ itemType }) => {
  return <h3>Removed {itemType} successfully!</h3>;
};

export default RemovedItemsMessage;
