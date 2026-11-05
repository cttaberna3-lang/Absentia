package com.kfjsdfs.studentplanner;

import android.content.Context;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;

/**
 * Keeps the last successfully loaded copy of every page the student opens, in the
 * app's private storage, so the app can still show their data with no internet.
 * The hosted pages are sent with "no-store" headers, so the normal WebView cache
 * can never do this by itself.
 */
final class OfflineCache {

    private static final int MAX_PAGE_CHARS = 4 * 1024 * 1024;

    private final File dir;

    OfflineCache(Context context) {
        dir = new File(context.getFilesDir(), "offline_pages");
        //noinspection ResultOfMethodCallIgnored
        dir.mkdirs();
    }

    /** Same page, with or without a #fragment, is the same saved copy. */
    static String normalize(String url) {
        if (url == null) return "";
        int hash = url.indexOf('#');
        return hash >= 0 ? url.substring(0, hash) : url;
    }

    private File fileFor(String url) {
        return new File(dir, sha1(normalize(url)) + ".html");
    }

    synchronized boolean save(String url, String html) {
        if (url == null || html == null || html.isEmpty() || html.length() > MAX_PAGE_CHARS) return false;
        File target = fileFor(url);
        File tmp = new File(dir, target.getName() + ".tmp");
        try (OutputStream out = new FileOutputStream(tmp)) {
            out.write(html.getBytes(StandardCharsets.UTF_8));
        } catch (IOException e) {
            //noinspection ResultOfMethodCallIgnored
            tmp.delete();
            return false;
        }
        return tmp.renameTo(target);
    }

    synchronized String load(String url) {
        File f = fileFor(url);
        if (!f.isFile()) return null;
        try (InputStream in = new FileInputStream(f); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            byte[] buf = new byte[8192];
            int n;
            while ((n = in.read(buf)) > 0) out.write(buf, 0, n);
            return new String(out.toByteArray(), StandardCharsets.UTF_8);
        } catch (IOException e) {
            return null;
        }
    }

    synchronized boolean has(String url) {
        return fileFor(url).isFile();
    }

    synchronized long savedAt(String url) {
        File f = fileFor(url);
        return f.isFile() ? f.lastModified() : 0L;
    }

    /** Wipes every saved page (used when someone signs in fresh, so one person's data never shows for another). */
    synchronized void clear() {
        File[] files = dir.listFiles();
        if (files == null) return;
        for (File f : files) {
            //noinspection ResultOfMethodCallIgnored
            f.delete();
        }
    }

    private static String sha1(String s) {
        try {
            byte[] d = MessageDigest.getInstance("SHA-1").digest(s.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (byte b : d) sb.append(String.format("%02x", b));
            return sb.toString();
        } catch (Exception e) {
            return Integer.toHexString(s.hashCode());
        }
    }
}
