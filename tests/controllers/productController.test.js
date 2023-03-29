const fs = require("fs");
const { getProducts, getProductById } = require("../../main/controllers/productController");

describe("Product Controller", () => {
  describe("getProducts", () => {
    it("should return all products", () => {
      // Arrange
      const mockProducts = [{ id: "1", name: "Product 1" }, { id: "2", name: "Product 2" }];
      jest.spyOn(fs, "readFileSync").mockReturnValue(JSON.stringify(mockProducts));
      const mockRes = { json: jest.fn() };

      // Act
      getProducts(null, mockRes);

      // Assert
      expect(mockRes.json).toHaveBeenCalledWith(mockProducts);
    });
  });

  describe("getProductById", () => {
    it("should return the product with the specified id", () => {
      // Arrange
      const mockProducts = [{ id: "1", name: "Product 1" }, { id: "2", name: "Product 2" }];
      const mockReq = { params: { id: "1" } };
      jest.spyOn(fs, "readFileSync").mockReturnValue(JSON.stringify(mockProducts));
      const mockRes = { json: jest.fn(), status: jest.fn().mockReturnThis() };

      // Act
      getProductById(mockReq, mockRes);

      // Assert
      expect(mockRes.json).toHaveBeenCalledWith(mockProducts[0]);
    });

    it("should return a 404 if the product with the specified id is not found", () => {
      // Arrange
      const mockProducts = [{ id: "1", name: "Product 1" }, { id: "2", name: "Product 2" }];
      const mockReq = { params: { id: "3" } };
      jest.spyOn(fs, "readFileSync").mockReturnValue(JSON.stringify(mockProducts));
      const mockRes = { json: jest.fn(), status: jest.fn().mockReturnThis() };

      // Act
      getProductById(mockReq, mockRes);

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Produit non trouvé" });
    });
  });
});
