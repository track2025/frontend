import React from 'react';
import ShopSettingFrom from 'src/components/forms/shopSetting';

export default function ShopSettingMain({ data, isLoading }) {
  return (
    <div>
      <ShopSettingFrom isLoading={isLoading} data={data} />
    </div>
  );
}
