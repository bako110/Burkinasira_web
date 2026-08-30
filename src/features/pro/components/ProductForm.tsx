import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, Spinner } from '../../../shared/ui';
import { extractApiErrorMessage } from '../../../shared/api/client';
import { useToastStore } from '../../../store/toast.store';
import type { FulfillmentMode, ProductCategory, ProductDetail } from '../../market/types';
import { useCreateMyProduct, useUpdateMyProduct } from '../hooks/useMyEstablishments';
import formStyles from './GuideProfileForm.module.css';

const PRODUCT_CATEGORIES: ProductCategory[] = [
  'tissus_vetements',
  'bijoux',
  'poterie',
  'sculpture',
  'objet_art',
  'produit_agricole',
  'produit_alimentaire',
  'souvenir',
];

const FULFILLMENT_MODES: FulfillmentMode[] = ['livraison', 'retrait', 'les_deux'];

interface ProductFormProps {
  product?: ProductDetail;
  onSaved: () => void;
  onCancel: () => void;
}

export function ProductForm({ product, onSaved, onCancel }: ProductFormProps) {
  const { t } = useTranslation();
  const push = useToastStore((s) => s.push);
  const createProduct = useCreateMyProduct();
  const updateProduct = useUpdateMyProduct();

  const [name, setName] = useState(product?.name ?? '');
  const [description, setDescription] = useState(product?.description ?? '');
  const [category, setCategory] = useState<ProductCategory>(product?.category ?? PRODUCT_CATEGORIES[0]);
  const [price, setPrice] = useState(product?.price !== undefined ? String(product.price) : '');
  const [stockQuantity, setStockQuantity] = useState(
    product?.stock_quantity !== undefined ? String(product.stock_quantity) : '0',
  );
  const [fulfillmentMode, setFulfillmentMode] = useState<FulfillmentMode>(product?.fulfillment_mode ?? 'les_deux');

  const isSaving = createProduct.isPending || updateProduct.isPending;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const payload = {
      name,
      description,
      category,
      price: Number(price) || 0,
      stock_quantity: stockQuantity ? Number(stockQuantity) : 0,
      fulfillment_mode: fulfillmentMode,
    };

    const onSettled = {
      onSuccess: () => {
        push({ variant: 'success', message: t('pro.establishmentSaved') });
        onSaved();
      },
      onError: (err: unknown) => push({ variant: 'error', message: extractApiErrorMessage(err, t('common.error')) }),
    };

    if (product) {
      updateProduct.mutate({ id: product.id, payload }, onSettled);
    } else {
      createProduct.mutate(payload, onSettled);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={formStyles.form}>
      <div className={formStyles.field}>
        <label htmlFor="product_name" className={formStyles.label}>
          {t('pro.name')}
        </label>
        <input
          id="product_name"
          className={formStyles.input}
          required
          minLength={2}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className={formStyles.field}>
        <label htmlFor="product_description" className={formStyles.label}>
          {t('pro.description')}
        </label>
        <textarea
          id="product_description"
          className={formStyles.textarea}
          rows={3}
          required
          minLength={10}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className={formStyles.field}>
        <label htmlFor="product_category" className={formStyles.label}>
          {t('pro.category')}
        </label>
        <select
          id="product_category"
          className={formStyles.select}
          value={category}
          onChange={(e) => setCategory(e.target.value as ProductCategory)}
        >
          {PRODUCT_CATEGORIES.map((option) => (
            <option key={option} value={option}>
              {t(`market.categories.${option}`, option)}
            </option>
          ))}
        </select>
      </div>

      <div className={formStyles.row}>
        <div className={formStyles.field}>
          <label htmlFor="product_price" className={formStyles.label}>
            {t('pro.priceLabel')}
          </label>
          <input
            id="product_price"
            type="number"
            step="any"
            className={formStyles.input}
            required
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <div className={formStyles.field}>
          <label htmlFor="product_stock" className={formStyles.label}>
            {t('pro.stockQuantity')}
          </label>
          <input
            id="product_stock"
            type="number"
            step="1"
            min="0"
            className={formStyles.input}
            value={stockQuantity}
            onChange={(e) => setStockQuantity(e.target.value)}
          />
        </div>
      </div>

      <div className={formStyles.field}>
        <label htmlFor="product_fulfillment" className={formStyles.label}>
          {t('pro.fulfillmentMode')}
        </label>
        <select
          id="product_fulfillment"
          className={formStyles.select}
          value={fulfillmentMode}
          onChange={(e) => setFulfillmentMode(e.target.value as FulfillmentMode)}
        >
          {FULFILLMENT_MODES.map((option) => (
            <option key={option} value={option}>
              {t(`market.fulfillment.${option}`, option)}
            </option>
          ))}
        </select>
      </div>

      <div className={formStyles.row}>
        <Button type="button" variant="secondary" fullWidth onClick={onCancel}>
          {t('pro.cancel')}
        </Button>
        <Button type="submit" fullWidth disabled={isSaving}>
          {isSaving ? <Spinner size={18} /> : t('pro.save')}
        </Button>
      </div>
    </form>
  );
}
