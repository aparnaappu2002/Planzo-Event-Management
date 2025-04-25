import { AdminRepository } from "../../adapters/repository/admin/adminRepository";
import { AdminLoginUseCase } from "../../useCases/admin/authentication/adminLoginuseCase";
import { JwtService } from "../services/jwtService";
import { RedisService } from "../services/redisService";
import { AdminLoginController } from "../../adapters/controllers/admin/adminLoginController";
import { VendorDatabase } from "../../adapters/repository/vendor/vendorDatabase";
import { FindAllVendorUsecase } from "../../useCases/admin/vendorManagement/findAllVendorUseCase";
import { FindAllVendorController } from "../../adapters/controllers/admin/findAllVendorController";
import { findAllPendingVendors } from "../../useCases/admin/vendorManagement/findAllPendingVendorUseCase";
import { FindAllPendingVendorController } from "../../adapters/controllers/admin/findAllPendingVendor";
import { ApproveVendorController } from "../../adapters/controllers/admin/approveVendorController";
import { ApproveVendor } from "../../useCases/admin/vendorManagement/approveVendorStatus";
import { RejectVendorUseCase } from "../../useCases/admin/vendorManagement/rejectVendorUseCase";
import { RejectVendorControllerAdmin } from "../../adapters/controllers/admin/rejectVendorController";
import { FindAllRejectedVendorUseCase } from "../../useCases/admin/vendorManagement/findAllRejectedVendorsUseCase";
import { FindAllRejectedController } from "../../adapters/controllers/admin/findAllRejectVendorController";
import { clientRepository } from "../../adapters/repository/client/clientRepository";
import { FindAllClientUseCase } from "../../useCases/admin/userManagement/findAllClientUseCase";
import { FindAllClientsController } from "../../adapters/controllers/admin/findAllClientsController";
import { BlockClientUseCase } from "../../useCases/admin/userManagement/clientBlockUseCase";
import { BlockClientController } from "../../adapters/controllers/admin/client/blockClientController";
import { ClientUnblockController } from "../../adapters/controllers/admin/client/unblockClientController";
import { ClientUnblockUseCase } from "../../useCases/admin/userManagement/clientUnblockUseCase";
import { VendorBlockUseCase } from "../../useCases/admin/vendorManagement/vendorBlockUseCase";
import { VendorBlockController } from "../../adapters/controllers/admin/vendor/vendorBlockController";
import { VendorUnblockUseCase } from "../../useCases/admin/vendorManagement/vendorUnblockUseCase";
import { VendorUnblockController } from "../../adapters/controllers/admin/vendor/vendorUnblockController";





//Admin Login
const adminRespository = new AdminRepository()
const adminLoginUseCase = new AdminLoginUseCase(adminRespository)
const jwtService = new JwtService()
const redisService = new RedisService()
export const injectedAdminLoginController = new AdminLoginController(adminLoginUseCase, jwtService, redisService)
// vendors all
const vendorDataBase = new VendorDatabase()
const findAllVendorUseCase = new FindAllVendorUsecase(vendorDataBase)
export const injectedFindAllVendorController = new FindAllVendorController(findAllVendorUseCase)
//pending vendors
const findAllPendingVendorUseCase = new findAllPendingVendors(vendorDataBase)
export const injectedFindAllPendingVendorController = new FindAllPendingVendorController(findAllPendingVendorUseCase)
//vendor approve
const approveVendorStatusUseCase = new ApproveVendor(vendorDataBase)
export const injectedApproveVendorStatus = new ApproveVendorController(approveVendorStatusUseCase)
//vendor reject
const rejectVendorUseCase = new RejectVendorUseCase(vendorDataBase)
export const injectedRejectVendorController = new RejectVendorControllerAdmin(rejectVendorUseCase)
//show all reject vendors
const findRejectedVendorUseCase = new FindAllRejectedVendorUseCase(vendorDataBase)
export const injectedFindAllRejectedVendorController = new FindAllRejectedController(findRejectedVendorUseCase)
//find all clients
const ClientRepository = new clientRepository()
const findAllClientUseCase = new FindAllClientUseCase(ClientRepository)
export const injectedFindAllClientController = new FindAllClientsController(findAllClientUseCase)
//block client
const blockClientUseCase = new BlockClientUseCase(ClientRepository)
export const injectedBlockClientController = new BlockClientController(blockClientUseCase, redisService)
//unblock client
const unblockClientUseCase = new ClientUnblockUseCase(ClientRepository)
export const injectedClientUnblockController = new ClientUnblockController(unblockClientUseCase, redisService)
//block vendor
const blockVendorUsecase = new VendorBlockUseCase(vendorDataBase)
export const injectedVendorBlockController = new VendorBlockController(blockVendorUsecase,redisService)
//unblock vendor
const unblockVendorUseCase = new VendorUnblockUseCase(vendorDataBase)
export const injectedVendorUnblockController = new VendorUnblockController(unblockVendorUseCase,redisService)