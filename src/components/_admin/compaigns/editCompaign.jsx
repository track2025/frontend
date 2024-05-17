import React from 'react';
import CompaignForm from 'src/components/forms/compaign';

export default function editCompaign({ data, isLoading }) {
  return (
    <div>
      <CompaignForm data={data} isLoading={isLoading} />
    </div>
  );
}
