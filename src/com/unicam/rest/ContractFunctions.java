package com.unicam.rest;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.ByteArrayOutputStream;
import java.io.File;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.lang.reflect.Parameter;
import java.math.BigInteger;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ExecutionException;
import java.util.stream.Stream;

import javax.ws.rs.Consumes;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.web3j.protocol.Web3j;
import org.web3j.protocol.admin.Admin;
import org.web3j.protocol.admin.methods.response.PersonalUnlockAccount;
import org.web3j.protocol.core.DefaultBlockParameterName;
import org.web3j.protocol.core.RemoteCall;
import org.web3j.protocol.core.methods.request.Transaction;
import org.web3j.protocol.core.methods.response.EthEstimateGas;
import org.web3j.protocol.core.methods.response.EthGetTransactionCount;
import org.web3j.protocol.core.methods.response.EthGetTransactionReceipt;
import org.web3j.protocol.core.methods.response.EthSendTransaction;
import org.web3j.protocol.core.methods.response.TransactionReceipt;
import org.web3j.protocol.http.HttpService;
import org.web3j.tx.Contract;
import org.web3j.tx.ManagedTransaction;
import org.web3j.tx.TransactionManager;
import org.web3j.tx.gas.ContractGasProvider;
import org.web3j.tx.gas.DefaultGasProvider;
import org.web3j.tx.gas.StaticGasProvider;
import org.web3j.utils.Numeric;

import com.unicam.model.ContractObject;
import com.unicam.model.Parameters;
import com.unicam.model.User;
//import com.unicam.resources.Choreography.InfoNextEventResponse;
import com.unicam.translator.Choreography;

import io.reactivex.Flowable;



import org.bson.Document;
import org.web3j.abi.FunctionEncoder;
import org.web3j.abi.TypeReference;
import org.web3j.abi.datatypes.Address;
import org.web3j.abi.datatypes.Bool;
import org.web3j.abi.datatypes.Function;
import org.web3j.abi.datatypes.Uint;
import org.web3j.abi.datatypes.Utf8String;
import org.web3j.abi.datatypes.Type;
import org.web3j.codegen.SolidityFunctionWrapperGenerator;
import org.web3j.tuples.*;
import org.web3j.tuples.generated.*;
import org.web3j.crypto.CipherException;
import org.web3j.crypto.Credentials;
import org.web3j.crypto.RawTransaction;
import org.web3j.crypto.TransactionEncoder;
import org.web3j.crypto.WalletUtils;

public class ContractFunctions {

	//private String address;
	//private String privateKey;
	//private String fileName;
	private List<String> participants;
	public List<String> tasks;
	public List<ContractObject> allFunctions;
	public String CONTRACT_ADDRESS = "";
	private static final String VirtualProsAccount = "0x0D49A19F4732184E03549a4A190684a316c725F7";
	
	public static boolean pendingTransaction = false;
	
	//ppublic static String projectPath = "/home/virtualpros/ChorChainStorage";
	public static String projectPath = System.getenv("ChorChain"); 
	
	Web3j web3j = Web3j.build(new HttpService("http://193.205.92.133:8545"));
	Admin adm = Admin.build(new HttpService("http://193.205.92.133:8545"));



	public ContractObject createSolidity(String fileName, Map<String, User> participants, List<String> freeRoles, List<String> mandatoryRoles) {
		Choreography cho = new Choreography();
		File f = new File(projectPath + File.separator + "bpmn"+ File.separator + fileName);
		try {
			//System.out.println(f.getAbsolutePath());
			cho.start(f, participants, freeRoles, mandatoryRoles);
			//allFunctions = cho.allFunctions;

			//Thread.sleep(15000);
			// System.out.print(cho.tasks);
		} catch (Exception e) {
			tasks = null;
			e.printStackTrace();
		}
		return cho.finalContract;
	}
	
	
	public void compile(String fileName) {
		try {
			//System.out.println(getServletContext().getInitParameter("upload.location"));
		
			 String fin = parseName(fileName, ".sol");

			String solPath = projectPath + File.separator + "resources" + File.separator + fin;
			//System.out.println("Solidity PATTT: " + solPath);
			String destinationPath = projectPath +  File.separator + "resources";//sostituire compiled a resources
			//System.out.println("destination path "+destinationPath);
			String[] comm = { "solc_old", solPath, "--bin", "--abi", "--overwrite", "-o", destinationPath };
			
			
			//String comm = "solc " + solPath + "--bin --abi --optimize -o " + destinationPath;

			Runtime rt = Runtime.getRuntime();

			Process p = rt.exec(comm);
			BufferedReader bri = new BufferedReader(new InputStreamReader(p.getInputStream()));
			BufferedReader bre = new BufferedReader(new InputStreamReader(p.getErrorStream()));
			String line;
			while ((line = bri.readLine()) != null) {
			     //System.out.println(line);
			}
			bri.close();
			while ((line = bre.readLine()) != null) {
			     //System.out.println(line);
			}
			bre.close();
			p.waitFor();
			  
			
			//System.out.println("abi-bin done");

		} catch (Exception e) {
			e.printStackTrace();

		}
	}

	public void wrapper(String fileName) {
		String path = projectPath + File.separator + "resources" + File.separator;
		String p = Paths.get("").toAbsolutePath().normalize().toString();
		//System.out.println(p);
		String abiPath = path + parseName(fileName, ".abi");
		String binPath = path + parseName(fileName, ".bin");

		String[] args2 = {"-a", abiPath, "-b", binPath, "-o", "src", "-p",
				projectPath + File.separator + "resources" + File.separator, };

		SolidityFunctionWrapperGenerator.main(args2);
		//System.out.println("Java contract done");
	}

	public Credentials getCredentialFromPrivateKey(String privateKey) throws IOException, CipherException {
		// return WalletUtils.loadCredentials("andrea",
		// "src/main/resources/UTC--2018-12-06T16-44-54.114315504Z--19a3f868355394b5423106fb31f201da646139af");
		return Credentials.create(privateKey);
	}

	public static String parseName(String name, String extension) {
		String[] oldName = name.split("\\.");

		String newName = oldName[0] + extension;
		return newName;
	}

	public String reflection(String toExec, String role) {
		String finalName = "";
		//System.out.println("sobo dentro al metodo");

		try {
			Class c = Class.forName("com.unicam.resources.Abstract");

			Method methods[] = c.getDeclaredMethods();

			Credentials credentials;

			credentials = WalletUtils.loadCredentials("123",
					projectPath + "/ChorChain/src/com/unicam/resources/UTC--2019-01-16T15-25-24.286179700Z--1adc6ea9d2ddc4dcb45bfc36f01ca8e266026155");
			//credentials = getCredentialFromPrivateKey("02D671CA1DC73973ED1E8FB53AA73235CC788DA792E41DB4170616EDED86D23D");
			
			//Credentials credentials1 = WalletUtils.loadCredentials("123", "C:/Users/Alessandro/Desktop/ChorChain/src/com/unicam/resources/UTC--2019-01-25T17-30-24.611307800Z--c3939b1fb6c589fc8636085dd4c52e9b61dab675");
			//Credentials credentials2 = WalletUtils.loadCredentials("123", "C:/Users/Alessandro/Desktop/ChorChain/src/com/unicam/resources/UTC--2019-01-25T17-28-43.107787100Z--bb98c741fc045cd434ad73080c7c90fa13d78958");
			
			RemoteCall returnv;

			// controllo l'array contenente i metodi per cercare il deploy
			for (Method method : methods) {
				if (method.getName() == "deploy" && toExec == "deploy") {

					Parameter[] params = method.getParameters();

					if (params.length == 3
							&& !params[1].getType().toString().equals(TransactionManager.class.toString())) {

						Object arglist[] = new Object[3];
						arglist[0] = web3j;
						arglist[1] = credentials;
						arglist[2] = new DefaultGasProvider();
						//System.out.println(arglist.length);
						returnv = (RemoteCall) method.invoke(c, arglist);
						// invio la remote call generata dal deploy
						Object address = returnv.send();
						CONTRACT_ADDRESS = ((Contract) address).getContractAddress();

						//System.out.println("Contract deployed at --> " + CONTRACT_ADDRESS + "<--");
						return null;

					}
				} else if (method.getName() == "subscribe_as_participant" && toExec == "subscribe_as_participant") {
					Class[] parameterTypes = new Class[4];
					parameterTypes[0] = String.class;
					parameterTypes[1] = Web3j.class;
					parameterTypes[2] = Credentials.class;
					parameterTypes[3] = ContractGasProvider.class;

					Method loadContract = c.getMethod("load", parameterTypes);
					Contract contract = (Contract) loadContract.invoke(c, CONTRACT_ADDRESS, web3j, credentials,
							new DefaultGasProvider());

					// com.unicam.resources.Choreography contract =
					// com.unicam.resources.Choreography.load(CONTRACT_ADDRESS, web3j, credentials,
					// new DefaultGasProvider());

					Object arglist[] = new Object[2];
					arglist[0] = role;
					arglist[1] = new BigInteger("0");
					RemoteCall<TransactionReceipt> returnv1 = (RemoteCall<TransactionReceipt>) method.invoke(contract,
							arglist);
					TransactionReceipt t = returnv1.send();
				    if (t != null) {

						Class[] parameter = new Class[1];
						parameter[0] = TransactionReceipt.class;
						Method getEvent = c.getMethod("getInfoEvents", parameter);

						List<Object> events = (List<Object>) getEvent.invoke(contract, t);
						for (Object e : events) {
							Field fi = e.getClass().getDeclaredField("next");
							//System.out.println(fi.get(e));
							finalName = (String) fi.get(e);
							return finalName;
							/*for (ContractObject co : allFunctions) {
								if(co.getName() == finalName) {
									return co;
								}
							}*/
						
						}
					}
					return null;

				}

			}
		}

		catch (Exception e) {
			e.printStackTrace();
		}
		
		return null;

	}

	public String readLineByLineJava8(String filePath, boolean bin) {
		StringBuilder contentBuilder = new StringBuilder();

		try (Stream<String> stream = Files.lines(Paths.get(filePath), StandardCharsets.UTF_8)) {
			if(bin)
				stream.forEach(s -> contentBuilder.append(s));
			else
				stream.forEach(s -> contentBuilder.append(s).append("\n"));
		} catch (IOException e) {
			e.printStackTrace();
		}

		return contentBuilder.toString();
	}
	
	public String deploy(String bin) throws Exception {
		  if(pendingTransaction == true) {
			  System.out.println("C'è una transazione pendente");
			  return "ERROR";
		  }
		 
		/*System.out.println(solPath);
		
		String solPath = projectPath + "ChorChain/src/com/unicam/resources/" + parseName(bin, ".sol");
		String[] comm = {"solc",
				"--gas",
				solPath,};


		Runtime rt = Runtime.getRuntime();
		Process p = rt.exec(comm);
		String gasEstimation = getStringFromInputStream(p.getInputStream());
		System.out.println(gasEstimation);
		gasEstimation = gasEstimation.split("=/s")[2].replaceAll("/D+","");
		System.out.println("GAS ESTIMATION: "+ gasEstimation);
		int result = Integer.parseInt(gasEstimation);*/
		//sostituire resources con compiled
		String binar = new String ( Files.readAllBytes( Paths.get(projectPath + "/resources/" + parseName(bin, ".bin"))));
		
		
		  //Unlocking the account
		  PersonalUnlockAccount personalUnlockAccount = adm.personalUnlockAccount(VirtualProsAccount, "andrea").send();
		  //Getting the nonce
		  
		  
		  EthGetTransactionCount ethGetTransactionCount = web3j.ethGetTransactionCount(
				  VirtualProsAccount, DefaultBlockParameterName.LATEST).sendAsync().get();
		  BigInteger nonce = ethGetTransactionCount.getTransactionCount();

		  BigInteger GAS_PRICE = BigInteger.valueOf(13_500_000_000L);
		  BigInteger GAS_LIMIT = BigInteger.valueOf(9_000_000L);
		 
		  BigInteger blockGasLimit = web3j.ethGetBlockByNumber(DefaultBlockParameterName.LATEST, false).send().getBlock().getGasLimit();
		  
		  Transaction transaction1 = Transaction.createContractTransaction(
			        VirtualProsAccount,
				  	nonce,
			        GAS_PRICE,
	                GAS_LIMIT,
	                BigInteger.ZERO,
			        "0x"+binar);

		  EthEstimateGas estimation = web3j.ethEstimateGas(transaction1).send();
		  BigInteger amountUsed = estimation.getAmountUsed();
		  // System.out.println("AMOUNT OF GAS USED: " + amountUsed + "AND current gas block limit(not used): " + blockGasLimit);
		  //send sync
		  EthSendTransaction transactionResponse = web3j.ethSendTransaction(transaction1).sendAsync().get();

		  pendingTransaction = true;
		  if(transactionResponse.hasError()) {
			  System.out.println(transactionResponse.getError().getData());
			  System.out.println(transactionResponse.getError().getMessage());
		  }
		  String transactionHash = transactionResponse.getTransactionHash();  
		  //System.out.println("Thash: " + transactionHash);
		  EthGetTransactionReceipt transactionReceipt = web3j.ethGetTransactionReceipt(transactionHash).send();
		 
		  //Optional<TransactionReceipt> receiptOptional = transactionReceipt.getTransactionReceipt();
		  for (int i = 0; i < 222220; i++) {
	            if (!transactionReceipt.getTransactionReceipt().isPresent()) {
	                //Thread.sleep(5000);
	                transactionReceipt = web3j.ethGetTransactionReceipt(transactionHash).send();
	      		    
	            } else {
	                break;
	            }
		  }
		  TransactionReceipt transactionReceiptFinal = transactionReceipt.getTransactionReceipt().get();
		System.out.println(transactionReceipt.getError());
		System.out.println(transactionReceipt.getRawResponse());
		  //System.out.println(transactionReceiptFinal.getContractAddress());
		  
		  String contractAddress = transactionReceiptFinal.getContractAddress();
		  System.out.println(contractAddress);
		  pendingTransaction = false;
		  //System.out.println(contractAddress);
		  return contractAddress;


		
	}
	
	private static String getStringFromInputStream(InputStream is) {

		BufferedReader br = null;
		StringBuilder sb = new StringBuilder();

		String line;
		try {

			br = new BufferedReader(new InputStreamReader(is));
			while ((line = br.readLine()) != null) {
				sb.append(line);
			}

		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			if (br != null) {
				try {
					br.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}

		return sb.toString();

	}
	
	public void signOffline(Parameters parameters, ContractObject contractDb, String account, String functionName) throws Exception {
		LinkedHashMap<String, String> hashed = contractDb.getTaskIdAndRole();
		//System.out.println("size di hashed: " + hashed.size());
		int b = 0;
		int z = 0;
		for(int i = 0; i < contractDb.getTasks().size(); i++) {
			//System.out.println("iiiiii: " + i);
			if(contractDb.getTasks().get(i).equals(functionName)) {
				//System.out.println("task trovato : " + contractDb.getTasks().get(i));
				//System.out.println("VALORE DI I : " + i);
				z = i;
				break;
			}
		}
		
		for(Map.Entry<String, String> params : hashed.entrySet()) {
			 //System.out.println("valore di b " + b + " e di i " + z);
			if(b == z) {
				functionName = params.getKey().split("\\(")[0];
				//System.out.println("chiave: " + params.getKey());
				break;
			}else {
				b++;
			}
		 }
		
		//System.out.println("NOME NUOVO DELLA FUNZIONE: " + functionName);
		
		BigInteger GAS_PRICE = BigInteger.valueOf(7_600_000_000L);
		BigInteger GAS_LIMIT = BigInteger.valueOf(6_700_000L);

		EthGetTransactionCount ethGetTransactionCount = web3j.ethGetTransactionCount(
				  account, DefaultBlockParameterName.LATEST).sendAsync().get();
		 BigInteger nonce = ethGetTransactionCount.getTransactionCount();
		 //System.out.println(nonce);
		 
		
		 List<Type> t = new ArrayList<Type>();
		 for(Map.Entry<String, String> params : parameters.getParamsAndValue().entrySet()) {
				if(params.getKey().equals("uint")) {
					int intValue = Integer.parseInt(params.getValue());
					t.add(new Uint(BigInteger.valueOf(intValue)));
				}else if(params.getKey().equals("string")) {
					t.add(new Utf8String(params.getValue()));
				}else if(params.getKey().equals("bool")) {
					boolean boolValue = Boolean.parseBoolean(params.getValue());
					t.add(new Bool(boolValue));
				}else if(params.getKey().equals("address")) {
					t.add(new Address(params.getValue()));
				}
			}
		
		 
		 
		 Function function = new Function(
				  functionName, 
				  t, 
				  Collections.emptyList()
				  );
		  
		  
		 String encoded = FunctionEncoder.encode(function);
		
		 
		 RawTransaction ta = RawTransaction.createTransaction(
				 nonce, 
				// BigInteger.valueOf(131),
				 GAS_PRICE, 
				 GAS_LIMIT,
				 //"0xcc8bdb5dd918c9ec86e31b416f627ad0cc5ea22d",
				 contractDb.getAddress(),
				 encoded
				 );

			Credentials credentials = getCredentialFromPrivateKey(parameters.getPrivateKey());
			byte[] signedMessage = TransactionEncoder.signMessage(ta, credentials);
			String hexValue = Numeric.toHexString(signedMessage);
			EthSendTransaction ethSendTransaction = web3j.ethSendRawTransaction(hexValue).sendAsync().get();
			//  if(ethSendTransaction.hasError()) {
				  //System.out.println(ethSendTransaction.getError().getData());
				  //System.out.println(ethSendTransaction.getError().getMessage());}
			String transactionHash = ethSendTransaction.getTransactionHash();
			EthGetTransactionReceipt transactionReceipt = web3j.ethGetTransactionReceipt(transactionHash).send();
			  
			  for (int i = 0; i < 222220; i++) {
				  //System.out.println("Wait: " + i);
		            if (!transactionReceipt.getTransactionReceipt().isPresent()) {
		                transactionReceipt = web3j.ethGetTransactionReceipt(transactionHash).send();
		            } else {
		                break;
		            }
			  }
			  TransactionReceipt transactionReceiptFinal = transactionReceipt.getTransactionReceipt().get();
			  //System.out.println(transactionReceiptFinal.getLogs());
			  //System.out.println(transactionReceiptFinal.getLogsBloom());
			
	}

}
