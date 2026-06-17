package com.smkarupatti;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

@SpringBootApplication
public class SmKarupattiApplication {
    public static void main(String[] args) {
        loadDotEnv();
        SpringApplication.run(SmKarupattiApplication.class, args);
        System.out.println("\n🌴 SM Original Karupatti API running on port 5000");
        System.out.println("🔗 http://localhost:5000/api/health\n");
    }

    private static void loadDotEnv() {
        try {
            // Check in backend directory first, then root
            String path = "backend/.env";
            if (!Files.exists(Paths.get(path))) {
                path = ".env";
            }
            if (Files.exists(Paths.get(path))) {
                List<String> lines = Files.readAllLines(Paths.get(path));
                for (String line : lines) {
                    line = line.trim();
                    if (line.isEmpty() || line.startsWith("#")) {
                        continue;
                    }
                    int eqIdx = line.indexOf('=');
                    if (eqIdx > 0) {
                        String key = line.substring(0, eqIdx).trim();
                        String value = line.substring(eqIdx + 1).trim();
                        // Strip quotes if present
                        if (value.startsWith("\"") && value.endsWith("\"")) {
                            value = value.substring(1, value.length() - 1);
                        } else if (value.startsWith("'") && value.endsWith("'")) {
                            value = value.substring(1, value.length() - 1);
                        }
                        System.setProperty(key, value);
                    }
                }
                System.out.println("[INFO] Loaded environment variables from: " + path);
            }
        } catch (IOException e) {
            System.err.println("[ERROR] Failed to load .env file: " + e.getMessage());
        }
    }
}
