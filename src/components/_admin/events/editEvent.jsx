import React from 'react';
// components
import EventsForm from 'src/components/forms/event';

export default function addBrand({ data, isLoading }) {
  return (
    <div>
      <EventsForm data={data} isLoading={isLoading} />
    </div>
  );
}
