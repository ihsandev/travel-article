"use client";

import { Title } from "../../_components/title";
import { FormArticle } from "../_components/form-article";

export default function AddArticle() {
  return (
    <div>
      <Title text="Add New Article" isShowBackButton />
      <FormArticle formType="create" />
    </div>
  );
}
