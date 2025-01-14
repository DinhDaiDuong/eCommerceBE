import db from "../models/index";
import IProductFilterBuilder from "./IProductFilterBuilder";

class ProductUserFilterBuilder extends IProductFilterBuilder {
    constructor() {
        super();
        this.filter = {
            where: {statusId: 'S1'},
            include: [
                { model: db.Allcode, as: 'brandData', attributes: ['value', 'code'] },
                { model: db.Allcode, as: 'categoryData', attributes: ['value', 'code'] },
                { model: db.Allcode, as: 'statusData', attributes: ['value', 'code'] },
            ],
            raw: true,
            nest: true,
        }
    }

    setPagination(data) {
        if (data.limit && data.offset) {
            this.filter.limit = +data.limit
            this.filter.offset = +data.offset
        }
        return this;
    }

    setCategory(data) {
        if (data.categoryId && data.categoryId !== 'ALL') this.filter.where = { categoryId: data.categoryId }
        return this;
    }

    setBrand(data) {
        if (data.brandId && data.brandId !== 'ALL') this.filter.where = { ...this.filter.where, brandId: data.brandId }
        return this;
    }

    setSortName(data) {
        if (data.sortName === "true") this.filter.order = [['name', 'ASC']]
        return this;
    }

    setKeyword(data) {
        if (data.keyword !== '') this.filter.where = { ...this.filter.where, name: { [Op.substring]: data.keyword } }
        return this;
    }

    build() {
        return this.filter;
    }
}
export default ProductUserFilterBuilder